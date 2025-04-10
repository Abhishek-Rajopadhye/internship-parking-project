"""changes 07042025

Revision ID: cb806720529a
Revises: 07f7d988c2fe
Create Date: 2025-04-07 10:06:57.385799

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'cb806720529a'
down_revision: Union[str, None] = '07f7d988c2fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_spots_address', table_name='spots')
    op.drop_index('ix_spots_available_slots', table_name='spots')
    op.drop_index('ix_spots_hourly_rate', table_name='spots')
    op.drop_index('ix_spots_latitude', table_name='spots')
    op.drop_index('ix_spots_longitude', table_name='spots')
    op.drop_index('ix_spots_no_of_slots', table_name='spots')
    op.drop_index('ix_spots_owner_id', table_name='spots')
    op.drop_index('ix_spots_spot_id', table_name='spots')
    op.drop_index('ix_spots_spot_title', table_name='spots')
    op.drop_table('spots')
    op.drop_index('ix_payments_id', table_name='payments')
    op.drop_table('payments')
    op.drop_index('ix_bookings_id', table_name='bookings')
    op.drop_table('bookings')
    op.drop_index('ix_reviews_id', table_name='reviews')
    op.drop_table('reviews')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reviews',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('spot_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('rating_score', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('review_description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('image', postgresql.BYTEA(), autoincrement=False, nullable=True),
    sa.Column('owner_reply', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='reviews_pkey')
    )
    op.create_index('ix_reviews_id', 'reviews', ['id'], unique=False)
    op.create_table('bookings',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('spot_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('total_slots', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('start_date_time', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('end_date_time', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('payment_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], name='bookings_payment_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='bookings_pkey')
    )
    op.create_index('ix_bookings_id', 'bookings', ['id'], unique=False)
    op.create_table('payments',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('spot_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('amount', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('razorpay_order_id', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('razorpay_payment_id', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('razorpay_signature', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='payments_pkey'),
    sa.UniqueConstraint('razorpay_order_id', name='payments_razorpay_order_id_key'),
    sa.UniqueConstraint('razorpay_payment_id', name='payments_razorpay_payment_id_key')
    )
    op.create_index('ix_payments_id', 'payments', ['id'], unique=False)
    op.create_table('spots',
    sa.Column('spot_id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('owner_id', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('spot_title', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('address', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('latitude', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('longitude', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('hourly_rate', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('no_of_slots', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('available_slots', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('open_time', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('close_time', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('available_days', postgresql.ARRAY(sa.VARCHAR()), autoincrement=False, nullable=False),
    sa.Column('image', postgresql.BYTEA(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['oauth_users.provider_id'], name='spots_owner_id_fkey'),
    sa.PrimaryKeyConstraint('spot_id', name='spots_pkey')
    )
    op.create_index('ix_spots_spot_title', 'spots', ['spot_title'], unique=False)
    op.create_index('ix_spots_spot_id', 'spots', ['spot_id'], unique=False)
    op.create_index('ix_spots_owner_id', 'spots', ['owner_id'], unique=False)
    op.create_index('ix_spots_no_of_slots', 'spots', ['no_of_slots'], unique=False)
    op.create_index('ix_spots_longitude', 'spots', ['longitude'], unique=False)
    op.create_index('ix_spots_latitude', 'spots', ['latitude'], unique=False)
    op.create_index('ix_spots_hourly_rate', 'spots', ['hourly_rate'], unique=False)
    op.create_index('ix_spots_available_slots', 'spots', ['available_slots'], unique=False)
    op.create_index('ix_spots_address', 'spots', ['address'], unique=False)
    # ### end Alembic commands ###
